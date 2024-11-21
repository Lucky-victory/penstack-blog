import { TimePicker as ReactTimePicker } from "react-time-picker";
export const TimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string | null) => void;
}) => {
  return (
    <ReactTimePicker
      value={value}
      onChange={onChange}
      shouldOpenClock={() => false}
    />
  );
};
