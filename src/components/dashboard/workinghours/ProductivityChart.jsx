import Chart from "react-apexcharts";

const ProductivityChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors: ["#10B981", "#F59E0B"],
    labels: ["Active", "Idle"],
    legend: {
      position: "bottom",
      offsetY: 8,
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val) => `${Math.round(val)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Productivity",
              formatter: () => `${data[0]?.value || 0}%`,
              style: {
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1F2937",
              },
            },
            value: {
              fontSize: "22px",
              fontWeight: 600,
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  const series = data.map((d) => d.value);

  return (
    <div className="bg-white rounded-[4px] border border-gray-100 p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Productivity Overview
        </h3>
      </div>
      {Chart && (
        <Chart
          options={chartOptions}
          series={series}
          type="donut"
          height={320}
        />
      )}
    </div>
  );
};

export default ProductivityChart;
