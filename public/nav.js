(function() {
  const navHtml = `
  <nav class="shared-nav">
    <div class="nav-inner">
      <a class="brand" href="index.html">CryptoTracker</a>
      <div class="hamburger">&#9776;</div>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="news.html" >News</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        
      </ul>
      <div class="auth-links">
        <a class="btn" href="login.html">Login</a>
        <a class="btn btn-outline" href="signup.html">Sign up</a>
      </div>
    </div>
  </nav>`;

  const container = document.getElementById('shared-nav');
  if (container) container.innerHTML = navHtml;

  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger){
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
})();
