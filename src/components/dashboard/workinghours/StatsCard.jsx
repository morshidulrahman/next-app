const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = "from-blue-500 to-blue-600",
  delay = 0,
}) => (
  <div
    className="bg-white rounded-[4px] border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-3">
          <div
            className={`w-10 h-10 rounded-[4px] bg-gradient-to-r ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon size={20} className="text-white" />
          </div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

export default StatsCard;
