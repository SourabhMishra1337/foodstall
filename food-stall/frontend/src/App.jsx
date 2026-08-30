import { useState } from "react";
import "./App.css";

const foodItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    id: 2,
    name: "Cheese Pizza",
    category: "Pizza",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
  },
  {
    id: 3,
    name: "Chicken Momos",
    category: "Momos",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600",
  },
  {
    id: 4,
    name: "French Fries",
    category: "Snacks",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
  },
  {
    id: 5,
    name: "Cold Coffee",
    category: "Drinks",
    price: 119,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },
  {
    id: 6,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
  },
];

function App() {
const [cart, setCart] = useState([]);
const [category, setCategory] = useState("All");
const [cartOpen, setCartOpen] = useState(false);

const [loginOpen, setLoginOpen] = useState(false);
const [otpSent, setOtpSent] = useState(false);
const [mobile, setMobile] = useState("");
const [otp, setOtp] = useState("");
const [loginLoading, setLoginLoading] = useState(false);
const [loginMessage, setLoginMessage] = useState("");

const sendOTP = async () => {
  if (mobile.length !== 10) {
    setLoginMessage("Please enter a valid 10-digit mobile number.");
    return;
  }

  try {
    setLoginLoading(true);
    setLoginMessage("");

    const response = await fetch(
      "http://localhost:5000/api/auth/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: `91${mobile}`,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setOtpSent(true);
      setLoginMessage("OTP sent successfully.");
    } else {
      setLoginMessage(data.message || "Could not send OTP.");
    }
  } catch (error) {
    console.error(error);
    setLoginMessage(
      "Unable to connect to the server. Make sure backend is running."
    );
  } finally {
    setLoginLoading(false);
  }
};

const verifyOTP = async () => {
  if (otp.length !== 4 && otp.length !== 6) {
    setLoginMessage("Please enter the OTP.");
    return;
  }

  try {
    setLoginLoading(true);
    setLoginMessage("");

    const response = await fetch(
      "http://localhost:5000/api/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: `91${mobile}`,
          otp: otp,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setLoginMessage("Login successful!");

      setTimeout(() => {
        setLoginOpen(false);
        setOtpSent(false);
        setMobile("");
        setOtp("");
        setLoginMessage("");
      }, 1000);
    } else {
      setLoginMessage(data.message || "Invalid OTP.");
    }
  } catch (error) {
    console.error(error);
    setLoginMessage("Unable to connect to the server.");
  } finally {
    setLoginLoading(false);
  }
};

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 20 : 0;
  const total = subtotal + deliveryFee;

  const categories = [
    "All",
    "Burgers",
    "Pizza",
    "Momos",
    "Snacks",
    "Drinks",
  ];

  const filteredItems =
    category === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === category);

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span>🍔</span>

          <div>
            <h2>Food Stall</h2>
            <small>Fresh • Fast • Delicious</small>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">

<button
  className="login-btn"
  onClick={() => setLoginOpen(true)}
>
  Login
</button>

          <button
            className="cart-btn"
            onClick={() => setCartOpen(true)}
          >
            🛒 Cart

            {totalItems > 0 && (
              <span className="cart-count">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO FOOD STALL
          </p>

          <h1>
            Delicious food,
            <br />
            <span>made fresh for you.</span>
          </h1>

          <p className="hero-description">
            Enjoy your favourite food made with fresh ingredients.
            Order online and get your food prepared just for you.
          </p>

          <div className="hero-buttons">

            <a href="#menu" className="primary-btn">
              Order Now →
            </a>

            <a href="#about" className="secondary-btn">
              Learn More
            </a>

          </div>

          <div className="hero-features">

            <div>
              <span>⚡</span>
              <p>Fast Service</p>
            </div>

            <div>
              <span>🥗</span>
              <p>Fresh Food</p>
            </div>

            <div>
              <span>❤️</span>
              <p>Made With Care</p>
            </div>

          </div>

        </div>

        <div className="hero-image">

          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
            alt="Delicious pizza"
          />

          <div className="floating-card">

            <span>⭐</span>

            <div>
              <strong>4.8/5</strong>
              <small>Customer Rating</small>
            </div>

          </div>

        </div>

      </section>

      {/* MENU */}
      <section className="menu-section" id="menu">

        <div className="section-heading">

          <div>
            <p>OUR MENU</p>
            <h2>What would you like today?</h2>
          </div>

          <span className="item-count">
            {filteredItems.length} Items
          </span>

        </div>

        {/* CATEGORIES */}
        <div className="categories">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "category active"
                  : "category"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>

          ))}

        </div>

        {/* FOOD */}
        <div className="food-grid">

          {filteredItems.map((item) => (

            <div className="food-card" key={item.id}>

              <div className="food-image">

                <img
                  src={item.image}
                  alt={item.name}
                />

                <span className="food-category">
                  {item.category}
                </span>

              </div>

              <div className="food-info">

                <h3>{item.name}</h3>

                <div className="food-bottom">

                  <strong>
                    ₹{item.price}
                  </strong>

                  <button
                    className="add-btn"
                    onClick={() => addToCart(item)}
                  >
                    + Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">

        <div>

          <p className="section-label">
            ABOUT US
          </p>

          <h2>
            Good food brings people together.
          </h2>

          <p>
            We are a local food outlet serving freshly prepared food
            for students, families and food lovers. Our goal is simple:
            good food, reasonable prices and quick service.
          </p>

          <div className="about-stats">

            <div>
              <strong>20+</strong>
              <span>Food Items</span>
            </div>

            <div>
              <strong>1000+</strong>
              <span>Happy Customers</span>
            </div>

            <div>
              <strong>4.8★</strong>
              <span>Rating</span>
            </div>

          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">

        <div>

          <p>HAVE A QUESTION?</p>

          <h2>
            Talk to us directly.
          </h2>

          <p>
            Need help with your order?
            Contact our store directly through WhatsApp.
          </p>

        </div>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          💬 Chat on WhatsApp
        </a>

      </section>

      {/* FOOTER */}
      <footer>

        <div>
          <h3>🍔 Food Stall</h3>
          <p>Fresh • Fast • Delicious</p>
        </div>

        <p>
          © 2026 Food Stall. All rights reserved.
        </p>

      </footer>

      {/* CART OVERLAY */}
      {cartOpen && (

        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >

          <div
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="cart-header">

              <div>
                <p>YOUR ORDER</p>
                <h2>Shopping Cart</h2>
              </div>

              <button
                className="close-cart"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>

            </div>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                  Add some delicious food to get started.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setCartOpen(false)}
                >
                  Browse Menu
                </button>

              </div>

            ) : (

              <>
                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-item-info">

                        <h3>{item.name}</h3>

                        <p>
                          ₹{item.price}
                        </p>

                        <div className="quantity-controls">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <div className="cart-item-right">

                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="cart-summary">

                  <div>
                    <span>Subtotal</span>
                    <strong>₹{subtotal}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>₹{deliveryFee}</strong>
                  </div>

                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total}</strong>
                  </div>

                  <button className="checkout-btn">
                    Proceed to Checkout →
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}
        {/* LOGIN MODAL */}
{loginOpen && (
  <div
    className="login-overlay"
    onClick={() => setLoginOpen(false)}
  >
    <div
      className="login-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="close-login"
        onClick={() => setLoginOpen(false)}
      >
        ×
      </button>

      {!otpSent ? (
        <>
          <div className="login-icon">
            📱
          </div>

          <p className="login-label">
            WELCOME BACK
          </p>

          <h2>Login to Food Stall</h2>

          <p className="login-description">
            Enter your mobile number and we'll send you
            a verification code.
          </p>

          <label>Mobile Number</label>

          <div className="phone-input">
            <span>+91</span>

            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobile}
              maxLength="10"
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
          </div>

          {loginMessage && (
            <p className="login-message">
              {loginMessage}
            </p>
          )}

          <button
            className="otp-button"
            onClick={sendOTP}
            disabled={loginLoading}
          >
            {loginLoading
              ? "Sending OTP..."
              : "Send OTP →"}
          </button>

          <p className="login-terms">
            By continuing, you agree to our terms and
            privacy policy.
          </p>
        </>
      ) : (
        <>
          <div className="login-icon">
            🔐
          </div>

          <p className="login-label">
            VERIFICATION
          </p>

          <h2>Enter OTP</h2>

          <p className="login-description">
            We sent a verification code to
            <strong> +91 {mobile}</strong>
          </p>

          <label>One-Time Password</label>

          <input
            className="otp-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength="6"
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          {loginMessage && (
            <p className="login-message">
              {loginMessage}
            </p>
          )}

          <button
            className="otp-button"
            onClick={verifyOTP}
            disabled={loginLoading}
          >
            {loginLoading
              ? "Verifying..."
              : "Verify & Login →"}
          </button>

          <button
            className="change-number"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setLoginMessage("");
            }}
          >
            ← Change mobile number
          </button>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );

}


export default App;