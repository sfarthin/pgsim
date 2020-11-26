export default function iteratorToArray<T>(iterator: Iterator<T, void>): T[] {
  const result = [];
  let curr = iterator.next();

  while (!curr.done) {
    result.push(curr.value);
    curr = iterator.next();
  }

  return result;
}
