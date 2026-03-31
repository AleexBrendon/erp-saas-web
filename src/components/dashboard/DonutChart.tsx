import Chart from "react-apexcharts";

type Props = {
    pie: any;
    data: any[];
};

export function DonutChart({ pie, data }: Props) {
    const total = data.reduce((acc, i) => acc + i.total, 0);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="mb-4">
                <h2 className="text-sm text-gray-500">Top5 Agendamentos</h2>
            </div>
            <Chart type="donut" height={240} {...pie} />
            <div className="mt-4 space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">

                        <div className="flex items-center gap-2">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: pie.options.colors[i],
                                }}
                            />
                            <span className="text-gray-600">{item.nome}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                            {((item.total / total) * 100).toFixed(1)}%
                            <span className="text-gray-400 ml-1">
                                ({item.total})
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}