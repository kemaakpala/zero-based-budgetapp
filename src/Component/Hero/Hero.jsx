const Hero = ({
  currency = "£",
  month = "January",
  income = 0.0,
  planned = 0.0,
  received = 0.0,
  totalSpent = 0.0,
}) => (
  <div className="hero-container">
    <h2>Income for {month}</h2>
    <h2>
      <span>{currency}</span>
      <span>{income}</span>
    </h2>
    <div>
      <div className="hero-planned-amount">
        <h3>Planned</h3>
        <h3 className="amount">
          <span>{currency}</span>
          <span>{planned}</span>
        </h3>
      </div>
      <div className="hero-received-amount">
        <h3>Received</h3>
        <h3 className="amount">
          <span>{currency}</span>
          <span>{received}</span>
        </h3>
      </div>
      {/* TODO: need to figure out how to calculate this and if we want the remaining amount to be here */}
      {/* <div className="hero-remaining-amount">
        <h3>Remaining</h3>
        <h3 className="amount">
          <span>{currency}</span>
          <span>{planned - totalSpent}</span>
        </h3>
      </div> */}
    </div>
  </div>
);

export default Hero;
