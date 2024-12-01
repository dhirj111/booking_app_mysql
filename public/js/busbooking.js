document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("appointmentForm");
  const ulElements = document.querySelector("ul");

  // Fetch all existing entries
  const fetchData = () => {
    axios
      .get("http://localhost:5000/appointmentData")
      .then((response) => {
        // Clear existing list
        ulElements.innerHTML = "";

        // Iterate through all products and create list items
        response.data.forEach((product) => {
          let liitem = document.createElement("li");
          liitem.innerHTML = `${product.name} - ${product.email} - ${product.phone} 
            <button class="edt" type="button" onclick="editEntry(${product.id}, '${product.name}', '${product.email}', '${product.phone}')">edit</button> 
            <button class="del" type="button" onclick="deleteEntry(${product.id})">delete</button>`;
          liitem.classList.add("bookings");
          ulElements.appendChild(liitem);
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch bookings');
      });
  };

  // Fetch data when DOM is loaded
  fetchData();

  // Default form submission handler
  const defaultFormSubmit = (event) => {
    event.preventDefault();

    const userDetails = {
      username: event.target.username.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
    };

    axios
      .post("http://localhost:5000/appointmentData", userDetails)
      .then((response) => {
        alert('Product created successfully!');
        fetchData(); // Refresh the list
        form.reset(); // Clear the form
      })
      .catch((error) => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Failed to create product');
      });
  };

  // Set the default form submit handler
  form.addEventListener("submit", defaultFormSubmit);

  // Delete entry function
  window.deleteEntry = (id) => {
    axios
      .delete(`http://localhost:5000/appointmentData/${id}`)
      .then((response) => {
        console.log('Data Deleted Successfully');
        fetchData(); // Refresh the list
      })
      .catch((error) => {
        console.error("Delete error", error);
        alert('Failed to delete product');
      });
  };

  // Edit entry function
  window.editEntry = (id, name, email, phone) => {
    // Populate form with existing data
    document.getElementById("username").value = name;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;

    // Remove the current submit event listener
    form.removeEventListener("submit", defaultFormSubmit);

    // Create a new submit handler for editing
    const editFormSubmit = (event) => {
      event.preventDefault();

      const updatedDetails = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
      };

      axios
        .put(`http://localhost:5000/appointmentData/${id}`, updatedDetails)
        .then((response) => {
          alert('Product updated successfully!');
          fetchData(); // Refresh the list
          form.reset(); // Clear the form

          // Remove the edit submit listener and restore default
          form.removeEventListener("submit", editFormSubmit);
          form.addEventListener("submit", defaultFormSubmit);
        })
        .catch((error) => {
          console.error("Update error", error);
          alert('Failed to update product');
        });
    };

    // Add the edit submit listener
    form.addEventListener("submit", editFormSubmit);
  };
});