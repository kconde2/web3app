# 🔌 Documentation API

Cette documentation décrit l'API REST du Vérificateur de Solde Web3.

## Base URL

```
http://localhost:3000/api
```

## Authentification

Aucune authentification n'est requise pour utiliser cette API.

## Endpoints

### POST /balance

Récupère le solde d'une adresse Ethereum sur une chaîne blockchain spécifiée.

#### URL
```
POST /api/balance
```

#### Headers
```
Content-Type: application/json
```

#### Paramètres du body

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `address` | string | ✅ | Adresse Ethereum au format hexadécimal (0x...) |
| `chain` | string | ✅ | Identifiant de la chaîne (`ethereum` ou `mode`) |

#### Exemple de requête

```json
{
  "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  "chain": "ethereum"
}
```

#### Réponses

##### Succès (200 OK)

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

##### Erreur de validation (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "message": "Adresse Ethereum invalide",
    "code": "INVALID_ADDRESS"
  }
}
```

##### Erreur serveur (500 Internal Server Error)

```json
{
  "success": false,
  "error": {
    "message": "Erreur lors de la récupération du solde",
    "code": "FETCH_ERROR"
  }
}
```

## Schémas de données

### BalanceRequest

```typescript
interface BalanceRequest {
  address: string;  // Format: 0x[40 caractères hexadécimaux]
  chain: "ethereum" | "mode";
}
```

### BalanceResponse (Succès)

```typescript
interface BalanceSuccessResponse {
  success: true;
  data: {
    address: string;           // Adresse consultée
    chain: string;             // Identifiant de la chaîne
    chainName: string;         // Nom complet de la chaîne
    balance: string;           // Solde en Wei (format string pour éviter les problèmes de précision)
    balanceFormatted: string;  // Solde formaté en ETH
    symbol: string;            // Symbole de la devise (toujours "ETH")
    explorer: string;          // URL de base de l'explorateur blockchain
  };
}
```

### BalanceResponse (Erreur)

```typescript
interface BalanceErrorResponse {
  success: false;
  error: {
    message: string;  // Message d'erreur lisible par l'utilisateur
    code?: string;    // Code d'erreur technique (optionnel)
  };
}
```

## Codes d'erreur

| Code | Description | Status HTTP |
|------|-------------|-------------|
| `MISSING_PARAMETERS` | Paramètres manquants dans la requête | 400 |
| `INVALID_ADDRESS` | Adresse Ethereum invalide | 400 |
| `UNSUPPORTED_CHAIN` | Chaîne blockchain non supportée | 400 |
| `FETCH_ERROR` | Erreur lors de la récupération du solde | 500 |
| `INTERNAL_ERROR` | Erreur interne du serveur | 500 |

## Chaînes supportées

| Identifiant | Nom complet | Explorateur |
|-------------|-------------|-------------|
| `ethereum` | Ethereum Mainnet | https://etherscan.io |
| `mode` | Mode Mainnet | https://explorer.mode.network |

## Limites et contraintes

### Rate Limiting
- Aucune limite de taux n'est actuellement implémentée
- Recommandation : Maximum 10 requêtes par seconde

### Timeouts
- Timeout de requête : 15 secondes
- Si une requête dépasse ce délai, une erreur de timeout sera retournée

### Validation des adresses
- L'adresse doit être au format hexadécimal valide
- L'adresse doit commencer par "0x"
- L'adresse doit faire exactement 42 caractères
- Validation selon la spécification EIP-55 (checksum)

## Exemples d'utilisation

### cURL

```bash
# Ethereum Mainnet
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{"address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", "chain": "ethereum"}'

# Mode Mainnet
curl -X POST http://localhost:3000/api/balance \
  -H "Content-Type: application/json" \
  -d '{"address": "0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4", "chain": "mode"}'
```

### JavaScript (fetch)

```javascript
async function getBalance(address, chain) {
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
}
```

### Python (requests)

```python
import requests

def get_balance(address, chain):
    url = "http://localhost:3000/api/balance"
    payload = {"address": address, "chain": chain}
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if not data["success"]:
        raise Exception(data["error"]["message"])
    
    return data["data"]

# Utilisation
balance = get_balance("0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", "ethereum")
print(f"Solde: {balance['balanceFormatted']} {balance['symbol']}")
```

### Node.js (axios)

```javascript
const axios = require('axios');

async function getBalance(address, chain) {
  try {
    const response = await axios.post('http://localhost:3000/api/balance', {
      address,
      chain
    });
    
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
}
```

## Gestion d'erreurs

### Stratégies de retry

Pour les erreurs temporaires (codes 5xx), il est recommandé d'implémenter une stratégie de retry avec backoff exponentiel :

```javascript
async function getBalanceWithRetry(address, chain, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getBalance(address, chain);
    } catch (error) {
      if (attempt === maxRetries || error.status < 500) {
        throw error;
      }
      
      // Backoff exponentiel : 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Validation côté client

```javascript
function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Vérification du format de base
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }
  
  return true;
}

function validateChain(chain) {
  return ['ethereum', 'mode'].includes(chain);
}
```

## Monitoring et observabilité

### Métriques recommandées

- Nombre de requêtes par seconde
- Temps de réponse moyen
- Taux d'erreur par type
- Utilisation des chaînes (ethereum vs mode)

### Logs

L'API génère des logs structurés pour faciliter le monitoring :

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Balance request processed",
  "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  "chain": "ethereum",
  "responseTime": 1250,
  "success": true
}
```

## Sécurité

### Bonnes pratiques

1. **Validation stricte** : Toutes les entrées sont validées côté serveur
2. **Pas de données sensibles** : Aucune donnée privée n'est stockée ou loggée
3. **CORS** : Configuration appropriée pour les requêtes cross-origin
4. **Rate limiting** : À implémenter en production

### Headers de sécurité recommandés

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Évolutions futures

### Fonctionnalités prévues

- Support de chaînes supplémentaires (Polygon, Arbitrum, etc.)
- Cache des résultats pour améliorer les performances
- Webhooks pour les notifications de changement de solde
- API key pour l'authentification
- Rate limiting configurable

### Versioning

L'API suit le versioning sémantique. Les changements breaking seront introduits dans une nouvelle version majeure avec un nouveau chemin d'API (ex: `/api/v2/balance`).
