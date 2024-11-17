import React, { useEffect, useState } from "react";
import {
  Banner,
  AssetComponent,
  AssetRow,
  TransactionRow,
  AssetChart,
  TransactionsChart,
  BalanceChart,
} from "./Components/OverviewComponents";
import styles from "./Overview.module.scss";
import FilterIcon from "../../assets/icons/FilterIcon.svg";
import SearchIcon from "../../assets/icons/SearchIcon.svg";
import TempImage from "../../assets/login/logo.png";
import { Account, User, Status, Transaction } from "../../Models/models";
import Loader from "../../Components/Navbar/Loader";

const Overview: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);

  //Function to help merge and sort transactions
  const mergeAndSortTransactions = (transactionsFrom: Transaction[], transactionsTo: Transaction[]) => {
    const fromTransactions = transactionsFrom.map((transaction) => ({
      ...transaction,
      timestamp: new Date(transaction.timestamp), 
      isFromTransaction: true,
    }));
  
    const toTransactions = transactionsTo.map((transaction) => ({
      ...transaction,
      timestamp: new Date(transaction.timestamp),
      isFromTransaction: false,
    }));
  
    return [...fromTransactions, ...toTransactions].sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime();
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const email = localStorage.getItem("email_to_validate");

      if (!email) {
        setError("No email found");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await fetch(
          `http://localhost:5122/api/User/email?email=${encodeURIComponent(
            email
          )}`
        );
        if (!userResponse.ok)
          throw new Error("Failed to fetch account details");

        const userData = await userResponse.json();
        setUser(userData);
        setAccount(userData.account);

        const sortedTransactions = mergeAndSortTransactions(
          userData.account.transactionsFrom.$values,
          userData.account.transactionsTo.$values
        );
        setAccount((prev) =>
          prev
            ? {
                ...prev,
                transactions: sortedTransactions,
              }
            : null
        );

        const statusResponse = await fetch("http://localhost:5122/api/Status");
        if (!statusResponse.ok) throw new Error("Failed to fetch statuses");

        const statusData = await statusResponse.json();
        setStatuses(statusData.$values);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = (newStatusId: number) => {
    if (user) {
      const accountId = account?.accountId;

      fetch(`http://localhost:5122/api/Account/upgradeStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId, newStatusId }),
      })
        .then((response) => {
          if (response.ok) {
            setUser((prev) =>
              prev
                ? {
                    ...prev,
                    account: {
                      ...prev.account,
                      account_status_id: newStatusId,
                    },
                  }
                : null
            );
          } else {
            throw new Error("Failed to upgrade account status");
          }
        })
        .catch((err) => console.error("Error upgrading account status:", err));
    }
  };

  console.log(account);
  console.log(statuses)
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.overview}>
      {user &&  (
        <Banner user={user} statuses={statuses} onUpgrade={handleUpgrade} />
      )}
      <div className={styles["text-title"]}>Overview</div>

     
      <div className={styles.statsContainer}>
        <div className={styles.assets}>
          <div className={styles["title"]}>Top Assets</div>
          <div className={styles.assetsList}>
            {account && (
              <>
                {/* Display the astro asset */}
                {account.astro && (
                  <AssetComponent
                    key={account.astro.astro_id}
                    {...account.astro}
                  />
                )}
              </>
            )}
            {!account && <p>No assets to display</p>}
          </div>
        </div>

        <div className={styles.portfolioasset}>
          <div className={styles["title"]}>Portfolio</div>
          <div className={styles["value"]}>
            {account ? `R${account.balance.toFixed(2)}` : "R0.00"}
          </div>
          <div className={styles.graphasset}>
            <AssetChart astro={account?.astro ? [account.astro] : []} />
          </div>
        </div>

        <div className={styles.portfolio}>
          <div className={styles["title"]}>Transactions</div>
          <div className={styles["value"]}>
            {account ? `${account.transactions?.length} Total` : "0"}
          </div>
          <div className={styles.graph}>
            <TransactionsChart
              transactionsFrom={account?.transactionsFrom.$values || []}
              transactionsTo={account?.transactionsTo.$values || []}
            />
          </div>
        </div>
      </div>

      <div className={styles.AssetTransactionContainer}>
        <div className={styles.portfolio3}>
          <div className={styles.graph3}>
            <BalanceChart transactions={account?.transactions || []} />
          </div>
        </div>

        <div className={styles.transactionTable}>
          <div className={styles.transactionTitle}>
            <div className={styles.title}>Recent Transactions</div>
          </div>
          <div className={styles.transactionTableContainer}>
            {account &&
            account.transactions &&
            account.transactions.length > 0 ? (
              account.transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transaction_id}
                  icon={TempImage}
                  transactionType={transaction.transactionType}
                  date={transaction.timestamp.toString()}
                  amount={transaction.amount.toFixed(2)}
                  isFromTransaction={transaction.isFromTransaction}
                />
              ))
            ) : (
              <p>No transactions to display</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.AssetTransactionContainer}>
        <div className={styles.assetTableContainer}>
          <div className={styles.titles}>
            <div className={styles.title}>Asset</div>
            <div className={styles.title}>Price</div>
            <div className={styles.title}>Balance</div>
            <div className={styles.title}>Proportion</div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.rows}>
            {/* Display the astro asset as a row */}
            {account?.astro && (
              <AssetRow
                key={account.astro.astro_id}
                image={TempImage}
                name={account.astro.name}
                price={`R${account.astro.price.toFixed(2)}`}
                balance={`R${(
                  account.astro.price * account.astro.tokens
                ).toFixed(2)}`}
                proportion={`${(
                  ((account.astro.price * account.astro.tokens) /
                    account.balance) *
                  100
                ).toFixed(2)}%`}
                abbreviation={account.astro.abbreviation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
