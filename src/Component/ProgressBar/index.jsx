import "./styles/progressBar.css";
const ProgressBar = ({ percentage }) => {
  return (
    <div className="group-item group-item-progress">
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percentage}%`,
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
