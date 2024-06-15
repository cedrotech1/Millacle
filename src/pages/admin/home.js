// Sidebar.js
import React from 'react';
// import 'datatables.net-dt/css/jquery.dataTables.css';

function Home() {
  return (
   <>
 <main id="main" class="main">

<div class="pagetitle">
  <h1>Blank Page</h1>
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="index.html">Home</a></li>
      <li class="breadcrumb-item">Pages</li>
      <li class="breadcrumb-item active">Home</li>
    </ol>
  </nav>
</div>

<section class="section">
  <div class="row">
    <div class="col-lg-6">

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">number of posts</h5>
          <p>12</p>
        </div>
      </div>

    </div>

    <div class="col-lg-6">

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Number of payments</h5>
          <p>20000 Rwf</p>
        </div>
      </div>

    </div>
  </div>
</section>


</main>
   </>
  );
}

export default Home;
