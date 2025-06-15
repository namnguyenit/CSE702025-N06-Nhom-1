//confirm xóa người dùng
const destroys = document.querySelectorAll(".btn-destroy");

// Bởi vì chỉ trong products add to cart mới hoạt động
if (destroys) {
  destroys.forEach((item) => {
    item.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(item);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        console.log("123");
        const res = await fetch("/users/destroy", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          item.parentNode.parentNode.parentNode.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    });
  });
}

//confirm hủy đơn

const destroyOrder = document.querySelectorAll(".btn-destroy-order");

console.log(destroyOrder);

if (destroyOrder) {
  destroyOrder.forEach((item) => {
    item.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(item);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        console.log("123");
        const res = await fetch("/orders/cancelled", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const status =
            item.parentNode.parentNode.parentNode.querySelector(
              "#chang-status"
            );
          status.innerHTML = "cancelled";
          const icon = item.parentNode.querySelector("#chang-status-icon");
          icon.innerHTML = `
<div class="form-button-action">
<button type="submit"
data-bs-toggle="tooltip"
title="cancelled"
class="btn btn-link btn-secondary">
<i
class="fa fa-hourglass-half"></i>
</button>
</div>
`;
          Swal.fire({
            title: "Cancelled!",
            text: "Your file has been cancelled.",
            icon: "success",
          });
        }
      }
    });
  });
}

//lấy tổng doanh thu

const priceTotal = document.querySelector("#price-total");
if (priceTotal) {
  priceTotalHandler();
}

async function priceTotalHandler() {
  const res = await fetch("/dashboard/price-total");
  const json = await res.json();
  console.log(json);
  priceTotal.innerHTML = `₫ ${json.totalAmount.toLocaleString(
    "vi-VN"
  )} <small>VND</small>`;
}

// lấy doanh thu theo tháng

monthlyTotalHandler();

async function monthlyTotalHandler() {
  const res = await fetch("/dashboard/total-month");
  const json = await res.json();
  console.log(json.monthlyTotals);

  var ctx = document.getElementById("statisticsChart").getContext("2d");

  var statisticsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        // {
        //   label: "Subscribers",
        //   borderColor: "#f3545d",
        //   pointBackgroundColor: "rgba(243, 84, 93, 0.6)",
        //   pointRadius: 0,
        //   backgroundColor: "rgba(243, 84, 93, 0.4)",
        //   legendColor: "#f3545d",
        //   fill: true,
        //   borderWidth: 2,
        //   data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374],
        // },
        // {
        //   label: "New Visitors",
        //   borderColor: "#fdaf4b",
        //   pointBackgroundColor: "rgba(253, 175, 75, 0.6)",
        //   pointRadius: 0,
        //   backgroundColor: "rgba(253, 175, 75, 0.4)",
        //   legendColor: "#fdaf4b",
        //   fill: true,
        //   borderWidth: 2,
        //   data: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521],
        // },
        {
          label: "Total Amount",
          borderColor: "#177dff",
          pointBackgroundColor: "rgba(23, 125, 255, 0.6)",
          pointRadius: 0,
          backgroundColor: "rgba(23, 125, 255, 0.4)",
          legendColor: "#177dff",
          fill: true,
          borderWidth: 2,
          data: json.monthlyTotals,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      layout: {
        padding: { left: 5, right: 5, top: 15, bottom: 15 },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontStyle: "500",
              beginAtZero: false,
              maxTicksLimit: 5,
              padding: 10,
            },
            gridLines: {
              drawTicks: false,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 10,
              fontStyle: "500",
            },
          },
        ],
      },
      legendCallback: function (chart) {
        var text = [];
        text.push('<ul class="' + chart.id + '-legend html-legend">');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push(
            '<li><span style="background-color:' +
              chart.data.datasets[i].legendColor +
              '"></span>'
          );
          if (chart.data.datasets[i].label) {
            text.push(chart.data.datasets[i].label);
          }
          text.push("</li>");
        }
        text.push("</ul>");
        return text.join("");
      },
    },
  });

  var dailySalesChart = document
    .getElementById("dailySalesChart")
    .getContext("2d");

  var myDailySalesChart = new Chart(dailySalesChart, {
    type: "line",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
      ],
      datasets: [
        {
          label: "Sales Analytics",
          fill: !0,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderColor: "#fff",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0,
          pointBorderColor: "#fff",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 5,
          data: [65, 59, 80, 81, 56, 55, 40, 35, 30],
        },
      ],
    },
    options: {
      maintainAspectRatio: !1,
      legend: {
        display: !1,
      },
      animation: {
        easing: "easeInOutBack",
      },
      scales: {
        yAxes: [
          {
            display: !1,
            ticks: {
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              beginAtZero: !0,
              maxTicksLimit: 10,
              padding: 0,
            },
            gridLines: {
              drawTicks: !1,
              display: !1,
            },
          },
        ],
        xAxes: [
          {
            display: !1,
            gridLines: {
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: -20,
              fontColor: "rgba(255,255,255,0.2)",
              fontStyle: "bold",
            },
          },
        ],
      },
    },
  });
}
