import Chart from "react-apexcharts";

type Props = {
  tipo: string;
  line: any;
};

export function MainChart({ tipo, line }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow col-span-2">
      <Chart
        type={tipo === "servicos" ? "bar" : "area"}
        height={300}
        series={line.series}
        options={line.options}
      />
    </div>
  );
}