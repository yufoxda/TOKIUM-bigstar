export function formatDateToJapanese(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
}

export  const formatDateToYYYYMMDD = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
};

export default formatDateToJapanese;