import "./styles/progressBar.css";

export interface ProgressBarProps {
  percentage: number;
  isOverspent?: boolean;
}

const ProgressBar = ({ percentage, isOverspent }: ProgressBarProps) => {
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
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
