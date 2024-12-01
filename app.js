const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
// Sequelize setup
const sequelize = new Sequelize('node-complete', 'root', '1@Password', {
  dialect: 'mysql',
  host: 'localhost'
});

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route to serve htmlmain.html
app.get('/', (req, res) => {
  console.log("Serving htmlmain.html");
  res.sendFile(path.join(__dirname, 'htmlmain.html'));
});

// Route for adding a user
app.post('/adduser', (req, res) => {
  console.log("Request received at /adduser");
  console.log(req.body);
  res.send("Add user endpoint hit");
});

// Route for handling appointment data
app.post('/appointmentData', (req, res) => {
  console.log("Received data at /appointmentData");
  console.log(req.body);

  const { username, email, phone } = req.body;

  Product.create({
    name: username,
    email: email,
    phone: phone
  })
    .then(result => {
      console.log('Created Product:', result);
      res.status(201).json({
        message: "Product created successfully",
        product: result
      });
    })
    .catch(err => {
      console.error('Error creating product:', err);
      res.status(500).json({ error: "Failed to create product", details: err.message });
    });
});

app.get('/appointmentData', (req, res) => {
  Product.findAll()
    .then(products => {
      res.json(products);
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: "Failed to fetch products" });
    });
});

// Delete a product
app.delete('/appointmentData/:id', (req, res) => {
  const productId = req.params.id;
  Product.destroy({
    where: { id: productId }
  })
    .then(result => {
      if (result) {
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    })
    .catch(err => {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: "Failed to delete product" });
    });
});

// Update a product
app.put('/appointmentData/:id', (req, res) => {
  const productId = req.params.id;
  const { username, email, phone } = req.body;

  Product.update(
    { name: username, email, phone },
    { where: { id: productId } }
  )
    .then(([updatedCount]) => {
      if (updatedCount > 0) {
        return Product.findByPk(productId);
      } else {
        throw new Error('Product not found');
      }
    })
    .then(updatedProduct => {
      res.json({ message: "Product updated successfully", product: updatedProduct });
    })
    .catch(err => {
      console.error('Error updating product:', err);
      res.status(500).json({ error: "Failed to update product" });
    });
});
// Sync Sequelize models and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
