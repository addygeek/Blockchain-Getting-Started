getBalance(address)
    {
     let balance= 0;
   
     
     this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if(transaction.from === address)
                {
                    balance -= transaction.amount;
                     balance -= transaction.gas;
                  
                }
                if(transaction.to === address)
                {
                    balance += transaction.amount;
                }
            });
     })
     console.log(`Gas spent by ${address}: ${gasSpent}`); // For debugging
     return balance;

    }