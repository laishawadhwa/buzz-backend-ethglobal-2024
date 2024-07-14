async function getBuzzScore(address) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic emtfZGV2X2Y0ODkyN2M5ZmUyZjQxOWM5NjQ4NDRmY2FjOWNkODE3Og=='
      }
    };
  
    try {
      const response = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd`, options);
      const data = await response.json();
      
      const walletData = data.data.attributes;
      const positionsDistributionByType = walletData.positions_distribution_by_type;
      const positionsDistributionByChain = walletData.positions_distribution_by_chain;
  
      let buzzScore = 0;
  
      // Calculate buzzScore for positions_distribution_by_type
      if (positionsDistributionByType.wallet > 1000 && positionsDistributionByType.wallet < 2000) {
        buzzScore += 30;
      } else if (positionsDistributionByType.wallet >= 150 && positionsDistributionByType.wallet <= 500) {
        buzzScore += 10;
      } else if (positionsDistributionByType.wallet > 500 && positionsDistributionByType.wallet < 1000) {
        buzzScore += 20;
      } else if (positionsDistributionByType.wallet >= 2000 && positionsDistributionByType.wallet <= 3500) {
        buzzScore += 40;
      } else if (positionsDistributionByType.wallet > 3500 && positionsDistributionByType.wallet <= 10000) {
        buzzScore += 50;
      } else if (positionsDistributionByType.wallet > 10000) {
        buzzScore += 100;
      }
  
      // Calculate buzzScore for positions_distribution_by_chain
      for (const chain in positionsDistributionByChain) {
        const value = positionsDistributionByChain[chain];
  
        if (chain === 'scroll' || chain === 'polygon') {
          if (value > 1000 && value < 2000) {
            buzzScore += 50;
          } else if (value >= 150 && value <= 500) {
            buzzScore += 20;
          } else if (value > 500 && value < 1000) {
            buzzScore += 30;
          } else if (value >= 2000 && value <= 3500) {
            buzzScore += 70;
          } else if (value > 3500 && value <= 10000) {
            buzzScore += 80;
          } else if (value > 10000) {
            buzzScore += 150;
          }
        } else {
          if (value > 1000 && value < 2000) {
            buzzScore += 30;
          } else if (value >= 150 && value <= 500) {
            buzzScore += 10;
          } else if (value > 500 && value < 1000) {
            buzzScore += 20;
          } else if (value >= 2000 && value <= 3500) {
            buzzScore += 40;
          } else if (value > 3500 && value <= 10000) {
            buzzScore += 50;
          } else if (value > 10000) {
            buzzScore += 100;
          }
        }
      }
  
      return buzzScore;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  
  // Example usage
  getBuzzScore('0x4b8a65c8ef37430edfaad1b61dba2d680f56ffd7').then(buzzScore => {
    console.log('Buzz Score:', buzzScore);
  });
  