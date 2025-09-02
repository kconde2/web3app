# 📋 Exemples d'utilisation

Ce document contient des exemples pratiques d'utilisation de l'application Vérificateur de Solde Web3.

## Interface utilisateur

### Exemple 1 : Consulter un solde sur Ethereum Mainnet

1. Ouvrez l'application dans votre navigateur
2. Dans le champ "Adresse Ethereum", saisissez : `0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97`
3. Sélectionnez "Ethereum Mainnet" dans le menu déroulant
4. Cliquez sur "Vérifier le solde"

**Résultat attendu :** Affichage du solde en ETH avec les détails de la transaction.

### Exemple 2 : Consulter un solde sur Mode Mainnet

1. Dans le champ "Adresse Ethereum", saisissez : `0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4`
2. Sélectionnez "Mode Mainnet" dans le menu déroulant
3. Cliquez sur "Vérifier le solde"

**Résultat attendu :** Affichage du solde en ETH sur le réseau Mode.

### Exemple 3 : Gestion d'erreur - Adresse invalide

1. Saisissez une adresse invalide : `0xinvalid`
2. Tentez de soumettre le formulaire

**Résultat attendu :** Message d'erreur avec validation en temps réel.

## API REST

### Exemple 1 : Requête Ethereum Mainnet

```bash
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
    "chain": "ethereum"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
    "chain": "ethereum",
    "chainName": "Ethereum Mainnet",
    "balance": "16121167002546892966",
    "balanceFormatted": "16.121167002546892966",
    "symbol": "ETH",
    "explorer": "https://etherscan.io"
  }
}
```

### Exemple 2 : Requête Mode Mainnet

```bash
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4",
    "chain": "mode"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "address": "0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4",
    "chain": "mode",
    "chainName": "Mode Mainnet",
    "balance": "42090552839598929",
    "balanceFormatted": "0.042090552839598929",
    "symbol": "ETH",
    "explorer": "https://explorer.mode.network"
  }
}
```

### Exemple 3 : Gestion d'erreur - Adresse invalide

```bash
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xinvalid",
    "chain": "ethereum"
  }'
```

**Réponse :**
```json
{
  "success": false,
  "error": {
    "message": "Adresse Ethereum invalide",
    "code": "INVALID_ADDRESS"
  }
}
```

### Exemple 4 : Gestion d'erreur - Chaîne non supportée

```bash
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
    "chain": "invalid"
  }'
```

**Réponse :**
```json
{
  "success": false,
  "error": {
    "message": "Chaîne non supportée: invalid",
    "code": "UNSUPPORTED_CHAIN"
  }
}
```

## Intégration JavaScript

### Exemple avec fetch()

```javascript
async function getBalance(address, chain) {
  try {
    const response = await fetch('/api/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, chain }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    throw error;
  }
}

// Utilisation
getBalance('0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97', 'ethereum')
  .then(balance => {
    console.log(`Solde: ${balance.balanceFormatted} ${balance.symbol}`);
  })
  .catch(error => {
    console.error('Erreur:', error.message);
  });
```

### Exemple avec axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getBalance(address, chain) {
  try {
    const response = await api.post('/api/balance', { address, chain });
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
}
```

## Tests de charge

### Exemple avec curl (test simple)

```bash
# Test de 10 requêtes simultanées
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -d '{"address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", "chain": "ethereum"}' &
done
wait
```

### Exemple avec Apache Bench

```bash
# Test de performance avec ab
ab -n 100 -c 10 -p post_data.json -T application/json http://localhost:3000/api/balance
```

Contenu de `post_data.json` :
```json
{"address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", "chain": "ethereum"}
```

## 🔍 Cas d'usage avancés

### Surveillance de multiple adresses

```javascript
const addresses = [
  { address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97', chain: 'ethereum' },
  { address: '0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4', chain: 'mode' },
];

async function monitorBalances() {
  const results = await Promise.allSettled(
    addresses.map(({ address, chain }) => getBalance(address, chain))
  );

  results.forEach((result, index) => {
    const { address, chain } = addresses[index];

    if (result.status === 'fulfilled') {
      console.log(`${chain}: ${address} = ${result.value.balanceFormatted} ETH`);
    } else {
      console.error(`Erreur pour ${address} sur ${chain}:`, result.reason.message);
    }
  });
}

// Surveillance toutes les 30 secondes
setInterval(monitorBalances, 30000);
```

### Intégration dans une application React

```jsx
import { useState, useCallback } from 'react';

function useBalance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchBalance = useCallback(async (address, chain) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error.message);
      }

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchBalance, loading, error, data };
}

// Utilisation dans un composant
function BalanceChecker() {
  const { fetchBalance, loading, error, data } = useBalance();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetchBalance(formData.get('address'), formData.get('chain'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="address" placeholder="Adresse Ethereum" required />
      <select name="chain" required>
        <option value="ethereum">Ethereum Mainnet</option>
        <option value="mode">Mode Mainnet</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Chargement...' : 'Vérifier'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h3>Solde: {data.balanceFormatted} {data.symbol}</h3>
          <p>Chaîne: {data.chainName}</p>
        </div>
      )}
    </form>
  );
}
```

## 📊 Monitoring et logs

### Exemple de logging côté serveur

```javascript
// Dans votre API route
console.log(`[${new Date().toISOString()}] Balance request:`, {
  address,
  chain,
  userAgent: request.headers.get('user-agent'),
  ip: request.headers.get('x-forwarded-for') || 'unknown'
});
```

### Métriques de performance

```javascript
// Mesurer le temps de réponse
const startTime = Date.now();
const balance = await client.getBalance({ address });
const responseTime = Date.now() - startTime;

console.log(`Balance fetched in ${responseTime}ms for ${chain}`);
```
