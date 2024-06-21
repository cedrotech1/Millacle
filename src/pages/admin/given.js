import React, { useState, useEffect } from 'react';

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState({});
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);  // Adjust the limit as needed
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');

  const fetchTransactions = async (offset, limit) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/transactions?offset=${offset}&limit=${limit}`, {
        headers: {
          'accept': '*/*',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAccountInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/account`, {
        headers: {
          'accept': '*/*',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error('Error fetching account information:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(offset, limit);
    fetchAccountInfo();
  }, [offset, limit]);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  return (
    <>
    {transactions.length>0 ? 
    <>
     <main id="main" className="main">
        <div className="pagetitle">
          <h1>Amaturo page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">amaturo</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">ACCOUNT INFORMATION</h5>
                  <h6 className='text-center' style={{ fontSize: '0.5cm', fontFamily: 'monospace', marginTop: '-0.5cm' }}>
                    {account.name}
                  </h6>
                  <p className='text-center'>Balance: {account.balance} Rwf</p>
                  <p className='text-center'>MTN Balance: {account.mtn_balance} Rwf</p>
                  <p className='text-center'>Airtel Balance: {account.airtel_balance} Rwf</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <br />
              <div className="card">
                <div className="card-body table-responsive">
                  <h5 className="card-title">list of users</h5>

                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Service</th>
                        {/* <th>Time</th> */}
                        <th>Fees</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={transaction.ref}>
                          {/* <td>{transaction.user_ref}</td> */}
                          <td>{transaction.amount} Rwf</td>
                          <td>{transaction.provider}</td>
                          {/* <td>{new Date(transaction.timestamp).toLocaleDateString()}</td> */}
                          <td>{transaction.fee}</td>
                          <td>{transaction.amount - transaction.fee} Rwf</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* <!-- End Table with stripped rows --> */}

                  <div className="pagination-controls">
                    <button
                      className="btn"
                      onClick={handlePreviousPage}
                      disabled={offset === 0}
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {Math.ceil(offset / limit) + 1} of {totalPages}
                    </span>
                    <button
                      className="btn"
                      onClick={handleNextPage}
                      disabled={offset + limit >= totalPages * limit}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>:
    <>
    loading...</>
    
  }
     
    </>
  );
}

export default Home;
