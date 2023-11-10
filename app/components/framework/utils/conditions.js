export default function equal(o1, o2) {
  if (typeof o1 !== typeof o2) {
    return false;
  }

  return (
    o1 === o2 ||
    (typeof o1 === "object" &&
      !(
        Object.keys(o1).some(
          key =>
            !(
              Object.prototype.hasOwnProperty.call(o2, key) &&
              equal(o1[key], o2[key])
            )
        ) ||
        Object.keys(o2).some(
          key =>
            !(
              Object.prototype.hasOwnProperty.call(o1, key) &&
              equal(o1[key], o2[key])
            )
        )
      ))
  );
}
