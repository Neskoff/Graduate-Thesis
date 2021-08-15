import axios from "axios";
export default async function getRequest(Route) {
  return await axios.get(Route).then((response) => response.data);
}
