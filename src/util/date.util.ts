import dayjs from "dayjs";
import { Service } from "typedi";

@Service()
export default class Date {
  constructor() {}

  getTime = () => {
    const now = dayjs().format("YYYY.MM.DD HH:mm:ss");

    return now;
  };
}
