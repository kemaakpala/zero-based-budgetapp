import "./styles/progressBar.css";
const ProgressBar = ({ percentage, isOverspent }) => {
  return (
    <div className="group-item-progress">
      <div className="progress">
        <div
          className={`progress-bar ${
            isOverspent ? "progress-bar--overspent" : ""
          }`}
          role="progressbar"
          style={{
            width: `${Math.min(100, percentage)}%`,
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
