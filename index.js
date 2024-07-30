import express from 'express';
import midtransClient from 'midtrans-client';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/', async (req, res) => {
  const { order_id, gross_amount, customer_details } = req.body;

  console.log('Request received:', req.body);

  const midtransServerKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-aVSYun8nN8bkx0Dg3aacu-Sn';

  // Create Snap API instance
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: midtransServerKey,
  });

  let parameter = {
    transaction_details: {
      order_id,
      gross_amount,
    },
    customer_details,
    enabled_payments: ["qris"],
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;
    console.log('Transaction Token:', transactionToken);

    res.status(200).json({ snapToken: transactionToken });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
