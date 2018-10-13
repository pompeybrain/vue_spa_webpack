declare interface FormatTimeOptions {
  timestamp: number;
  isMilli?: boolean;
  splitChar?: string;
  onlyDate?: boolean;
}

function formatTime({
  timestamp,
  isMilli,
  splitChar,
  onlyDate
}: FormatTimeOptions) {
  const date = new Date(isMilli ? timestamp : timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour12: false
  });
  if (splitChar) {
    return `${year}${splitChar}${month}${splitChar}${day} ${
      onlyDate ? "" : time
    }`;
  }
  return `${year}-${month}-${day} ${onlyDate ? "" : time}`;
}

function pennyToDollar(dollar: number) {
  return dollar / 100;
}

function formatRatio(ratio: number) {
  return Math.round(ratio * 100) + "%";
}

export { formatTime, pennyToDollar, formatRatio };
