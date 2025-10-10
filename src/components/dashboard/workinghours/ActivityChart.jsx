import Chart from "react-apexcharts";

const ActivityChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors: ["#10B981", "#3B82F6", "#E5E7EB"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        type: "vertical",
        colorStops: [
          { offset: 0, color: "#10B981", opacity: 0.4 },
          { offset: 50, color: "#3B82F6", opacity: 0.3 },
          { offset: 100, color: "#E5E7EB", opacity: 0.2 },
        ],
      },
    },
    xaxis: {
      categories: data.map((d) => d.day),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Hours",
        style: { color: "#6B7280" },
      },
      labels: {
        style: { colors: "#6B7280" },
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 3,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}h`,
      },
    },
  };

  const series = [
    {
      name: "Total Time",
      data: data.map((d) => d.totalTime || 0),
    },
    {
      name: "Active Time",
      data: data.map((d) => d.activeTime || 0),
    },
    {
      name: "Idle Time",
      data: data.map((d) => d.idleTime || 0),
    },
  ];

  return (
    <div className="bg-white rounded-[4px] border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Activity Breakdown
        </h3>
      </div>
      {Chart && (
        <Chart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
      )}
    </div>
  );
};

export default ActivityChart;
