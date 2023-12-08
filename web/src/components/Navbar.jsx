const Navbar = () => {
  return (
    <nav
      className="h-16 text-white relative shadow-sm font-mono mt-6"
      role="navigation"
    >
      <ul>
        <div className="flex justify-center items-center">
          <img className="h-10 w-42 ml-8" src="/traiflix.png" alt="logo"/>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;