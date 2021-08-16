<script>
import { Line } from "vue3-chart-v2";
const config = {
  innerWidth: 400,
  innerHeight: 400,
  type: "line",
  data: data,
};
const labels = [1, 2, 3, 4, 5, 6, 7];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
export default {
  name: "detailsPage",
  extends: Line,
  mounted() {
    this.renderChart(data, config);
  },
};
</script>
