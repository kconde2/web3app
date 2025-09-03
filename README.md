# 🔍 Vérificateur de Solde Web3

Une application Web3 Full Stack développée avec Next.js qui permet de consulter le solde d'adresses Ethereum sur différentes chaînes blockchain.

![Bun](https://img.shields.io/badge/Bun-1.0+-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Viem](https://img.shields.io/badge/Viem-2.37.4-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-blue)

## ✨ Fonctionnalités

- 🔗 **Multi-chaînes** : Support d'Ethereum Mainnet et Mode Mainnet
- ⚡ **Temps réel** : Récupération instantanée des soldes depuis la blockchain
- 🛡️ **Sécurisé** : Validation robuste des adresses et gestion d'erreurs complète
- 📱 **Responsive** : Interface moderne et adaptative
- 🚀 **Performance** : Optimisé avec Next.js App Router et Turbopack
- 🎨 **UX/UI** : Interface intuitive avec états de chargement et feedback utilisateur

## 🚀 Démarrage rapide

### Prérequis

- **Bun** 1.0+ (runtime JavaScript ultra-rapide)

### Installation

1. **Installer Bun** (si pas déjà fait)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   # ou
   npm install -g bun
   ```

2. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd web3app
   ```

3. **Installer les dépendances**
   ```bash
   bun install
   ```

4. **Lancer le serveur de développement**
   ```bash
   bun run dev
   ```

5. **Ouvrir l'application**

   Rendez-vous sur [http://localhost:3001](http://localhost:3001) dans votre navigateur.

## 📖 Utilisation

### Interface utilisateur

1. **Saisir une adresse Ethereum** : Entrez une adresse valide (format 0x...)
2. **Sélectionner une chaîne** : Choisissez entre Ethereum Mainnet ou Mode Mainnet
3. **Consulter le solde** : Cliquez sur "Vérifier le solde" pour obtenir les résultats

### Adresses de test

- **Ethereum Mainnet** : `0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97`
- **Mode Mainnet** : `0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4`

### API Endpoint

L'application expose également un endpoint API REST :

```bash
POST /api/balance
Content-Type: application/json

{
  "address": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  "chain": "ethereum"
}
```

## 🏗️ Architecture

### Structure du projet

```
src/
├── app/                    # Next.js App Router
│   ├── api/balance/       # Endpoint API
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── BalanceForm.tsx    # Formulaire de saisie
│   ├── BalanceResult.tsx  # Affichage des résultats
│   ├── ErrorDisplay.tsx   # Gestion d'erreurs UI
│   └── LoadingSpinner.tsx # Indicateurs de chargement
├── lib/                   # Utilitaires et services
│   ├── chains.ts          # Configuration des chaînes
│   ├── viem-clients.ts    # Clients blockchain
│   ├── balance-service.ts # Service de récupération
│   ├── validation.ts      # Schémas de validation
│   ├── formatters.ts      # Utilitaires de formatage
│   └── error-handler.ts   # Gestion d'erreurs
└── types/                 # Types TypeScript
    └── blockchain.ts      # Types métier
```

### Technologies utilisées

- **[Bun](https://bun.sh/)** : Runtime JavaScript ultra-rapide avec test runner intégré
- **[Next.js 15](https://nextjs.org/)** : Framework React avec App Router
- **[Viem](https://viem.sh/)** : Bibliothèque TypeScript pour Ethereum
- **[TypeScript](https://www.typescriptlang.org/)** : Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** : Framework CSS utilitaire
- **[React Hook Form](https://react-hook-form.com/)** : Gestion de formulaires
- **[Zod](https://zod.dev/)** : Validation de schémas TypeScript

## 🔧 Scripts disponibles

```bash
# Développement avec Turbopack
bun run dev

# Build de production
bun run build

# Démarrage en production
bun run start

# Tests avec Bun
bun test

# Tests avec Jest (alternative)
bun run test:jest

# Tests en mode watch
bun run test:watch

# Tests avec couverture
bun run test:coverage
```

## 🎯 Choix techniques

### Pourquoi Viem ?

- **Performance** : Plus rapide et léger que Web3.js ou Ethers.js
- **TypeScript natif** : Excellent support TypeScript avec types auto-générés
- **Moderne** : API moderne avec support des dernières fonctionnalités Ethereum
- **Modulaire** : Import seulement des fonctionnalités nécessaires

### Pourquoi Next.js App Router ?

- **Performance** : Rendu côté serveur et optimisations automatiques
- **Developer Experience** : Hot reload, TypeScript intégré, structure claire
- **API Routes** : Backend et frontend dans le même projet
- **Production-ready** : Optimisations automatiques pour la production

### Architecture de validation

- **Côté client** : Validation en temps réel avec React Hook Form + Zod
- **Côté serveur** : Double validation pour la sécurité
- **Gestion d'erreurs** : Système centralisé avec messages utilisateur-friendly

## 📚 Documentation API

### POST /api/balance

Récupère le solde d'une adresse Ethereum sur une chaîne spécifiée.

#### Paramètres

```typescript
{
  address: string;  // Adresse Ethereum (format 0x...)
  chain: "ethereum" | "mode";  // Chaîne blockchain
}
```

#### Réponse de succès (200)

```typescript
{
  success: true;
  data: {
    address: string;           // Adresse consultée
    chain: string;             // Chaîne utilisée
    chainName: string;         // Nom complet de la chaîne
    balance: string;           // Solde en Wei (string)
    balanceFormatted: string;  // Solde formaté en ETH
    symbol: string;            // Symbole de la devise (ETH)
    explorer: string;          // URL de l'explorateur
  };
}
```

#### Réponse d'erreur (400/500)

```typescript
{
  success: false;
  error: {
    message: string;  // Message d'erreur lisible
    code?: string;    // Code d'erreur technique
  };
}
```

#### Exemples d'utilisation

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

## 🛡️ Gestion d'erreurs

L'application gère plusieurs types d'erreurs :

- **Validation** : Adresses invalides, chaînes non supportées
- **Réseau** : Problèmes de connexion, timeouts
- **Blockchain** : Erreurs spécifiques aux nœuds
- **Serveur** : Erreurs internes

Chaque erreur est accompagnée d'un message explicite et de conseils de résolution.

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
bun add -g vercel

# Déployer
vercel
```

### Docker

```dockerfile
FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production
COPY . .
RUN bun run build
EXPOSE 3001
CMD ["bun", "run", "start"]
```

## 🧪 Tests

### Tests manuels

1. **Adresses valides** : Tester avec les adresses fournies
2. **Adresses invalides** : Vérifier la gestion d'erreurs
3. **Chaînes différentes** : Tester Ethereum et Mode
4. **Responsivité** : Tester sur mobile/desktop

### Tests automatisés

```bash
# Tests avec Bun (recommandé)
bun test

# Tests avec Jest
bun run test:jest

# Tests en mode watch
bun run test:watch

# Tests avec couverture
bun run test:coverage
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Viem](https://viem.sh/) pour l'excellente bibliothèque Ethereum
- [Next.js](https://nextjs.org/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour les styles
- [Mode Network](https://mode.network/) pour la Layer 2
