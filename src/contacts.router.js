import express from "express";
import Contact from "./contact.model.js";
import mongoose from "mongoose";
import auth from "./auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", async (_, res) => {
  //   const contacts = await Contact.find();
  const contacts = await Contact.find().select("name phone email owner");
  return res.send(contacts);
});
contactsRouter.post("/", auth, async (req, res) => {
  const contact = new Contact(req.body);
  contact.owner = req.user._id;
  await contact.save();
  return res.send(contact);
});
contactsRouter.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.sendStatus(404);
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact)
    return res
      .status(404)
      .send(`Le contact avec l'id ${req.params.id} n'existe pas.`);
  return res.send(contact);
});
contactsRouter.patch("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.sendStatus(404);
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact)
    return res
      .status(404)
      .send(`Le contact avec l'id ${req.params.id} n'existe pas.`);

  //   1.Avec cette approche, pas besoin de faire un findById avant
  //   const updatedContact = await Contact.findByIdAndUpdate(
  //     req.params.id,
  //     req.body,
  //     { new: true }
  //   );

  //  2. updateOne
  //   const updatedContact = await Contact.updateOne(
  //     { _id: req.params.id },
  //     req.body
  //   );

  // 3.Avec le résultat de find by id
  for (let attribut in req.body) {
    contact[attribut] = req.body[attribut];
  }

  await contact.save();

  return res.send(contact);
});
contactsRouter.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.sendStatus(404);
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact)
    return res
      .status(404)
      .send(`Le contact avec l'id ${req.params.id} n'existe pas.`);

  await Contact.deleteOne({ _id: req.params.id });
  return res.send("Contact supprimé avec succès");
});

export default contactsRouter;
