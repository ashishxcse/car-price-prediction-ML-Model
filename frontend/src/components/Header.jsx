import logo from '../assets/logo.png';

/**
 * Header component with minimal logo and title
 */
function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Car Value Estimator" className="header-logo" />
      <h1>Car Value Estimator</h1>
      <p>Precision AI pricing for your vehicle.</p>
    </header>
  );
}

export default Header;
