import React from "react";
import styles from "./OverviewComponents.module.scss";
import ShipIcon from "../../../assets/icons/ShipIcon.svg";
import StatsIcon from "../../../assets/icons/StatsIcon.svg";
import StackIcon from "../../../assets/icons/StackIcon.svg";
import LevelIcon from "../../../assets/icons/LevelIcon.svg";
import MoreIcon from "../../../assets/icons/MoreIcon.svg";
import {
  User,
  Status,
  Asset,
  Astro,
  Transaction,
} from "../../../Models/models";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
} from "chart.js";
import TempImage from "../../../assets/login/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChartData, ChartOptions } from "chart.js";

interface BannerProps {
  user: User;
  statuses: Status[];
  onUpgrade: (newStatusId: number) => void;
}

export const Banner: React.FC<BannerProps> = ({
  user,
  statuses,
  onUpgrade,
}) => {
  const [currentStatusId, setCurrentStatusId] = useState(user?.account?.status?.statusId);

  useEffect(() => {
    setCurrentStatusId(user?.account?.status?.statusId);
  }, [user?.account?.status?.statusId]);

  const currentAccountStatus = statuses?.find(
    (status) => status.status_id === currentStatusId
  );

  const nextStatus = statuses?.find(
    (status) => status.status_id === currentStatusId + 1 && status.status_id <= 4
  );

  const transactionsTo = user.account.transactionsFrom.$values ?? [];
  const transactionsFrom = user.account.transactionsTo.$values ?? [];
  const totalTransactions = transactionsTo.length + transactionsFrom.length;
  const totalAmount = user.account.balance;

  const canUpgrade =
    nextStatus &&
    (totalTransactions >= nextStatus.transactions_criteria ||
      totalAmount >= nextStatus.total_amount_criteria);

  const isMaxStatus = currentAccountStatus?.status_id === 4;

  const handleUpgrade = (statusId : number) => {
    onUpgrade(statusId);
  };

  return (
    <div className={styles.banner}>
      <div className={styles["text-wrapper-1"]}>
        Welcome back, {user.username}
      </div>

      <div className={styles.frameContainer}>
        <Frame
          title="Current Level"
          content={currentAccountStatus?.status_name || "Unknown"}
          description={`Criteria: ${
            currentAccountStatus?.transactions_criteria
          } transactions or R${currentAccountStatus?.total_amount_criteria.toFixed(
            2
          )}`}
          icon={ShipIcon}
        />
        <Frame
          title="Interest Rate"
          content={`${
            (currentAccountStatus?.annual_interest_rate || 0) * 100
          }%`}
          description={`Next -> ${
            (nextStatus?.annual_interest_rate || 0) * 100
          }%`}
          icon={StatsIcon}
        />
        <Frame
          title="Transaction Fee"
          content={`${currentAccountStatus?.transaction_fee} Coins`}
          description="Per Transaction"
          icon={StackIcon}
        />
        <Frame
          title="Next Upgrade"
          content={canUpgrade ? "Available" : isMaxStatus ? "Max Status" : "Not Yet"}
          description={
            canUpgrade
              ? `Upgrade to ${nextStatus?.status_name}`
              : isMaxStatus
                ? "You have reached the highest status."
                : `Need ${Math.max(
                    nextStatus?.transactions_criteria? - totalTransactions : 0,
                    0
                  )} more transactions or R${Math.max(
                    nextStatus?.total_amount_criteria? - totalAmount : 0,
                    0
                  ).toFixed(2)} more`
          }
          icon={LevelIcon}
          onClick={() => canUpgrade && nextStatus ? handleUpgrade(nextStatus.status_id) : null}
          className={canUpgrade ? styles.upgradeAvailable : ""}
        />
        {canUpgrade && (
          <Frame
            title="Upgrade Now!"
            content="Click to apply"
            description="Get the next level benefits now"
            icon={LevelIcon}
            onClick={() => nextStatus ? handleUpgrade(nextStatus.status_id) : null}
            className={styles.upgradeFrame}
          />
        )}
      </div>
    </div>
  );
};

type FrameProps = {
  title: string;
  content: string;
  description: string;
  icon: string;
  onClick?: () => void;
  className?: string;
};

export const Frame = ({
  title,
  content,
  description,
  icon,
  onClick,
  className,
}: FrameProps) => {
  return (
    <div className={styles.frame}>
      <div className={styles["div"]}>
        <div className={styles["text-wrapper"]}>{title}</div>
        <img className={styles.img} alt="Frame" src={icon} />
      </div>
      <div className={styles["text-wrapper-2"]} onClick={onClick}>
        {content}
      </div>
      <div className={styles["text-wrapper-3"]}>{description}</div>
      <div
        className={`${styles.vector} ${className ? styles.greenVector : ""}`}
      />
    </div>
  );
};

type AssetComponentProps = {
  name: string;
  abbreviation: string;
  price: number;
  tokens: number;
  astro_price?: number;
};

export const AssetComponent = ({
  name,
  abbreviation,
  price,
  tokens,
  astro_price,
}: AssetComponentProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/purchasing");
  };

  return (
    <div className={styles.asset}>
      <img className={styles["image"]} src={TempImage} alt="" />
      <div className={styles["content"]}>
        <div className={styles["name"]}>
          {name} ({abbreviation})
        </div>
        <div className={styles["amount"]}>{tokens}</div>
        <div className={styles["change"]}>R{price * tokens}</div>
      </div>
      <div className={styles["button"]} onClick={handleViewDetails}>
        <div className={styles["details"]}>View Details</div>
      </div>
    </div>
  );
};

type AssetRowProps = {
  image: string;
  name: string;
  price: string;
  balance: string;
  proportion: string;
  abbreviation: string;
};

export const AssetRow = ({
  image,
  name,
  price,
  balance,
  proportion,
  abbreviation,
}: AssetRowProps) => {
  return (
    <div className={styles.assetRow}>
      <div className={styles["imageContainer"]}>
        <img className={styles["image"]} src={image} alt="" />
        <div className={styles["nameContainer"]}>
          <div className={styles["name"]}> {name}</div>
          <div className={styles["abreviation"]}> {abbreviation}</div>
        </div>
      </div>

      <div className={styles["price"]}> {price}</div>
      <div className={styles["balance"]}> {balance}</div>
      <div className={styles["proportion-container"]}>
        <div className={styles["proportion-bar"]}></div>
        <div className={styles["proportion"]}> {proportion}</div>
      </div>
      <img className={styles["vector"]} src={MoreIcon} alt=""></img>
    </div>
  );
};

type TransactionRowProps = {
  icon: string;
  transactionType: string;
  date: string;
  amount: string;
  isFromTransaction?: boolean;
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
  icon,
  transactionType,
  date,
  amount,
  isFromTransaction,
}) => {
  //This is to format the date to a readable format
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));

  return (
    <div className={styles.transactionRow}>
      <div className={styles.iconContainer}>
        <img className={styles.icon} src={icon} alt="Transaction Icon" />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.transactionType}>{transactionType}</div>
        <div className={styles.date}>{formattedDate}</div>
      </div>
      <div
        className={styles.amount}
        style={{ color: isFromTransaction ? "#0b9457" : "#fc684e" }}
      >
        R{amount}
      </div>
    </div>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface AssetChartProps {
  astro: Astro[];
}

export const AssetChart: React.FC<AssetChartProps> = ({ astro }) => {
  const combinedAssets = [
    ...astro.map((a) => ({ name: a.name, tokens: a.tokens })),
  ];

  const data = {
    labels: combinedAssets.map((item) => item.name),
    datasets: [
      {
        label: "Amount Owned",
        data: combinedAssets.map((item) => item.tokens),
        backgroundColor: "#7E4AC0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: "white",
      },
      tooltip: {
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

interface TransactionsChartProps {
  transactionsFrom: Transaction[];
  transactionsTo: Transaction[];
}

export const TransactionsChart: React.FC<TransactionsChartProps> = ({
  transactionsFrom,
  transactionsTo,
}) => {
  const fromCount = transactionsFrom.length;
  const toCount = transactionsTo.length;
  const totalCount = fromCount + toCount;

  const data = {
    labels: ["Total Transactions", "Transactions From", "Transactions To"],
    datasets: [
      {
        label: "Number of Transactions",
        data: [totalCount, fromCount, toCount],
        backgroundColor: ["#7E4AC0", "#bb2c50", "#0074a4"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Transactions Breakdown",
        color: "white",
      },
      tooltip: {
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

interface BalanceChartProps {
  transactions: Transaction[] | undefined;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({ transactions }) => {
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      console.log("No transactions available.");
      setChartData({});
      return;
    }

    console.log("Transactions on mount:", transactions);

    const dataFrom = transactions
      .filter((transaction) => transaction.isFromTransaction)
      .map((transaction) => transaction.amount);
    const dataTo = transactions
      .filter((transaction) => !transaction.isFromTransaction)
      .map((transaction) => transaction.amount);

    const data = {
      labels: transactions.map((transaction) =>
        transaction.isFromTransaction ? "Sent" : "Received"
      ),
      datasets: [
        {
          label: "Received",
          data: dataFrom,
          borderColor: "#00e396",
          backgroundColor: "rgba(0, 227, 150, 0.5)",
          fill: false,
        },
        {
          label: "Sent",
          data: dataTo,
          borderColor: "#ff4560",
          backgroundColor: "rgba(255, 69, 96, 0.5)",
          fill: false,
        },
      ],
    };

    setChartData(data);
  }, [transactions]);

  if (!chartData || Object.keys(chartData).length === 0) {
    return <div>No transaction data available</div>;
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Transaction History",
        color: "white",
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Line data={chartData} options={options} />
    </div>
  );
};
