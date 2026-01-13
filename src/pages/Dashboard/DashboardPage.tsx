import React, { useMemo } from "react";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Shield,
  Clock,
  Calendar,
  ArrowRight,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Layout from "../../components/Layout/Layout";
import { useCustomers, useCustomerStatistics, useMonthlyCustomerRegistrations } from "../../hooks/useCustomer";
import type { ActivityPayload } from "../../api/officerApi";
import { useActivityLogs } from "../../hooks/useOfficer";
// Types
interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  trend: number;
  trendUp: boolean;
  color: "primary" | "success" | "warning" | "danger";
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  time: string;
  type: "success" | "warning" | "primary" | "info";
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
}
type ActivityType = "primary" | "success" | "info" | "warning";


const verificationData = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 52 },
  { day: "Wed", count: 38 },
  { day: "Thu", count: 67 },
  { day: "Fri", count: 58 },
  { day: "Sat", count: 23 },
  { day: "Sun", count: 15 },
];


const DashboardPage: React.FC = () => {
  //  const { data: customers, isLoading, isError, error } = useCustomers();
  const {
    data: statistics,
    isLoading,
    isError,
    error,
  } = useCustomerStatistics();

const {
  data: registrationRaw,
  isLoading: registrationLoading,
  isError: registrationError,
  error: registrationErrorObj,
} = useMonthlyCustomerRegistrations();

const registrationData = useMemo(() => {
  if (!registrationRaw || !Array.isArray(registrationRaw)) return [];

  return registrationRaw.map((it) => ({
    month: it.month,
    registrations: it.registrations, // Default to 0 as the API doesn't provide this field
  }));
}, [registrationRaw]);
// console.log("Registration Data:", registrationData);

  // put the value here dynamcally after fetching
  const statusData = [
    {
      name: "Active",
      value: statistics?.active_customers || 0,
      color: "#10B981",
    },
    {
      name: "Expired",
      value: statistics?.expired_customers || 0,
      color: "#F59E0B",
    },
  ];
  // i will put the value here dynamically after fetching
  const stats: StatCardProps[] = [
    {
      icon: <Users className="w-6 h-6" />,
      value: statistics?.total_customers || 0,
      label: "Total Registered Customers",
      trend: 12,
      trendUp: true,
      color: "primary",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      value: statistics?.active_customers || 0,
      label: "Active ID Cards",
      trend: 8,
      trendUp: true,
      color: "success",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      value: statistics?.expired_customers || 0,
      label: "Expired ID Cards",
      trend: 3,
      trendUp: false,
      color: "warning",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: statistics?.registered_this_month || 0,
      label: "New This Month",
      trend: 24,
      trendUp: true,
      color: "primary",
    },
  ];
  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityDataError,
    error:activityError,
    isSuccess: activitySuccess,
  } = useActivityLogs();

  const resolveActivityType = (action = ""): ActivityType => {
    if (!action) return "info";
    if (action.startsWith("Registered_customer")) {
      return "primary";
    } else if (action.startsWith("Registered_officer")) {
      return "info";
    } else if (action.startsWith("Renew_Customer")) {
      return "success";
    }
    return "info";
  };

  const safeGetTime = (dateLike: unknown): number => {
    try {
      const d = new Date(String(dateLike || ""));
      const t = d.getTime();
      return Number.isFinite(t) ? t : 0;
    } catch {
      return 0;
    }
  };

  const formatTimeString = (dateLike: unknown): string => {
    if (!dateLike) return "";
    const ts = safeGetTime(dateLike);
    if (!ts) return String(dateLike);
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return String(dateLike);
    }
  };
  // Format and map the data (memoized)
  const recentActivity = useMemo(() => {
    const activity = activityData || [];
    return (activity as ActivityPayload[])
      .map((officer: ActivityPayload, idx: number) => {
        const rawTime = safeGetTime(officer?.timestamp);
        return {
          id: officer?.id ?? `unknown-${idx}`,
          icon: <UserPlus className="w-5 h-5" />,
          text: officer?.action ?? "Activity",
          time: formatTimeString(officer?.timestamp),
          rawTime,
          type: resolveActivityType(officer?.action ?? ""),
        } as unknown as ActivityItem & { rawTime: number };
      })
      .sort((a, b) => (b.rawTime || 0) - (a.rawTime || 0))
      .slice(0, 5);
  }, [activityData]);


  const alerts: AlertItem[] = [
    {
      id: "1",
      title: "IDs Expiring This Week",
      description: `${
        statistics?.expiring_this_week || 0
      } customer ID cards are scheduled to expire within the next 7 days.`,
      count: statistics?.expiring_this_week || 0,
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "2",
      title: "IDs Expiring This Month",
      description: `${
        statistics?.expiring_this_month || 0
      } customer ID cards will expire by the end of December.`,
      count: statistics?.expiring_this_month || 0,
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: "bg-emerald-50 text-emerald-600",
      success: "bg-green-50 text-green-600",
      warning: "bg-amber-50 text-amber-600",
      danger: "bg-red-50 text-red-600",
      info: "bg-blue-50 text-blue-600",
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <Layout
      activePage="dashboard"
      pageTitle="Dashboard Overview"
      pageSubtitle="Welcome back, here's what's happening today"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${getColorClasses(
                  stat.color
                )} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                {stat.icon}
              </div>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  stat.trendUp
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.trendUp ? "↑" : "↓"} {stat.trend}%
              </div>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-1 font-mono">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {isError && (
        <div className="mb-6 p-3 rounded bg-red-50 border border-red-100 text-red-700">
          Error loading dashboard statistics: {String(error?.message ?? error ?? "Unknown error")}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {
          registrationLoading ? (
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Registration & Verification Trend</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center h-[280px] text-slate-500">Loading registration data...</div>
            </div>
          ) : registrationError ? (
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Registration & Verification Trend</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 rounded bg-red-50 border border-red-100 text-red-700">Error loading registration data: {String(registrationErrorObj?.message ?? registrationErrorObj ?? 'Unknown error')}</div>
            </div>
          ) : registrationData.length > 0 ? (
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Registration & Verification Trend</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: "12px", fontWeight: 500 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px", fontWeight: 500 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Legend wrapperStyle={{ fontSize: "13px", fontWeight: 500 }} />
                  <Line type="monotone" dataKey="registrations" stroke="#059669" strokeWidth={3} dot={{ fill: "#059669", r: 5 }} activeDot={{ r: 7 }} name="Registrations" />
                  <Line type="monotone" dataKey="verifications" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} activeDot={{ r: 7 }} name="Verifications" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Registration & Verification Trend</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center h-[280px] text-slate-500">Couldn't load registration data.</div>
            </div>
          )
        }
        

        {/* ID Status Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">ID Card Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Verifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Weekly Verifications
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                style={{ fontSize: "12px", fontWeight: 500 }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: "12px", fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "rgba(5, 150, 105, 0.1)" }}
              />
              <Bar
                dataKey="count"
                fill="#059669"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h3>
            <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="text-sm text-slate-500">Loading activities...</div>
            ) : activityDataError || activityError ? (
              <div className="text-sm text-red-600">
                <p>Could not load activities.</p>
                <p className="mt-1">{String(activityError?.message ?? 'No access or server error')}</p>
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-lg ${getColorClasses(
                      activity.type
                    )} group-hover:bg-white/20 group-hover:text-white transition-colors`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-white transition-colors">
                      {activity.text}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 group-hover:text-white transition-colors">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No recent activity</div>
            )}
          </div>
        </div>

        {/* Expiry Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              ⚠ Expiry Alerts
            </h3>
            <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
              Manage <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-bold font-mono">
                    {alert.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
