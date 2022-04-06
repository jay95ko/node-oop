import dayjs from "dayjs";
import { Service } from "typedi";

@Service()
export default class Date {
  constructor() {}

  getTime = () => {
    return dayjs().format("YYYY.MM.DD HH:mm:ss");
  };

  formatDate = (date: string) => {
    return dayjs(date).format("YYYY.MM.DD HH:mm:ss");
  };
}
