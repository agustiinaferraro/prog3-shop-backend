import express from "express";
import nodemailer from "nodemailer";
import createError from "http-errors";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { cart, userEmail } = req.body;

    if (!cart || !cart.length) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }
    if (!userEmail || !userEmail.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    //genera numero de orden (ej simple con fecha y num aleatorio)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    //transporte nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //contenido del mail
    const itemsHtml = cart
      .map(item => {
        const name = item.title || item.city || "Producto";
        const qty = item.quantity || 1;
        const price =
          Number(
            item.price ||
              item.variant?.price ||
              item.variants?.[0]?.price?.$numberInt ||
              item.variants?.[0]?.price ||
              0
          ) * qty;
        return `<li>${name} x ${qty} - $${price}</li>`;
      })
      .join("");

    const total = cart.reduce((acc, item) => {
      const price =
        Number(
          item.price ||
            item.variant?.price ||
            item.variants?.[0]?.price?.$numberInt ||
            item.variants?.[0]?.price ||
            0
        ) * (item.quantity || 1);
      return acc + price;
    }, 0);

    const mailOptions = {
      from: `"Tu tienda" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Compra exitosa - Nº de orden: ${orderNumber}`,
      html: `
        <h2>¡Gracias por tu compra!</h2>
        <p><strong>Número de orden:</strong> ${orderNumber}</p>
        <p>Estos son los productos que compraste:</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> $${total}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Compra realizada correctamente", orderNumber });
  } catch (err) {
    console.error(err);
    next(createError(500, "Error al enviar pedido"));
  }
});

export default router;