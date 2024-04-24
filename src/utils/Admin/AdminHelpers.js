export function formatBusTravelTime(record) {
  let pickUpTime = record?.pickUpTime;
  if (record?.isVrl) {
    pickUpTime = pickUpTime?.split(" ");
    if (
      (pickUpTime[1] === "PM" && +pickUpTime[0]?.split(":")[0] !== 12) ||
      (pickUpTime[1] === "AM" && +pickUpTime[0]?.split(":")[0] === 12)
    ) {
      let formattedTime = +pickUpTime[0]?.split(":")[0] + 12;
      formattedTime = formattedTime >= 24 ? formattedTime % 24 : formattedTime;
      pickUpTime[0] =
        String(formattedTime) + ":" + pickUpTime[0]?.split(":")[1];
    }
    return pickUpTime[0];
  }
  return pickUpTime;
}
