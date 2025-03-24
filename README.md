# 🥏 Discgolf RESTful API

Detta API hanterar data för **discgolf-discar** och deras **tillverkare**. API:t följer RESTful principer och är byggt med Node.js, Express och MongoDB.  
inlagt för dig att testa finns 3 stycken tillverkare som alla har 2 discar av varje typ i databasen. Relationen är One to Many.
Instruktioner för att lägga till fler discar och tillverkare finns nedan.

## 🛠️ Installation och uppstart av projektet

Det här projektet är byggt med:

- **Node.js**
- **Express**
- **MongoDB (via Mongoose)**
- **CORS**
- **TypeScript**
- **nodemon**

---

## 📦 1. Klona projektet (om det är på GitHub)

```bash
git clone https://github.com/Wille1989/U05.git
```

---

## 📁 2. Installera beroenden

Kör följande kommando i projektmappen:

```bash
npm install
```

Detta installerar alla nödvändiga paket jag har använt:

- `express`
- `mongoose`
- `cors`
- `dotenv`
- `typescript`
- `nodemon`

---

## 🔧 3. Kompilera TypeScript

Projektet är skrivet i TypeScript, så det måste kompileras till JavaScript innan det körs:

```bash
npm run build
```

Det skapar en `dist/`-mapp med den kompilerade koden.

---

## 🔐 4. Skapa en `.env`-fil

Skapa en fil i projektets rotmapp som heter `.env` och kopiera in följande:

```env
MONGO_URI = mongodb+srv://<ditt-användarnamn>:<ditt-lösenord>@<cluster-url>/<databasnamn>?retryWrites=true&w=majority&appName=<appNamn>
PORT = 3000
```

Obs! Du behöver en egen MongoDB Atlas-databas för att kunna köra projektet lokalt.
Om du bara vill testa funktionerna, använd den deployade versionen på:
[https://u05-wbsp.onrender.com](https://u05-wbsp.onrender.com)

> 🔁 Byt ut `<...>` med dina egna MongoDB Atlas-uppgifter.

---

## 🚀 5. Starta projektet

### Utvecklingsläge (med nodemon)

```bash
npm run dev
```

Detta kompilerar TypeScript och startar servern med `nodemon`, så att den automatiskt startas om vid ändringar.

### Produktion eller manuell körning

```bash
npm run build
npm start
```

---

## 🧾 Exempel på `package.json`-scripts

Lägg till detta i din `package.json`:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "ts-node src/server.ts",
  "prepare": "npm run build"
}
```

## 🚀 Base URL

```bash
https://u05-wbsp.onrender.com
```

---

## 📦 Endpoints & Funktioner

### 🥏 Discs

| Metod | Endpoint                       | Beskrivning                         |
|-------|--------------------------------|-------------------------------------|
| GET   | `/api/discs/index`            | Hämta alla discs                    |
| GET   | `/api/discs/show/:id`         | Hämta en disc med ID               |
| POST  | `/api/discs/create`           | Skapa en ny disc                   |
| PATCH | `/api/discs/update/:id`       | Uppdatera disc med ID              |
| DELETE| `/api/discs/delete/:id`       | Ta bort en disc med ID             |

---

### 🏠 Manufacturers

| Metod | Endpoint                             | Beskrivning                          |
|-------|--------------------------------------|--------------------------------------|
| GET   | `/api/manufacturer/index`           | Hämta alla tillverkare i databasen |
| POST  | `/api/manufacturer/create`          | Skapa ny tillverkare                 |
| DELETE| `/api/manufacturer/delete/:id`      | Ta bort tillverkare + relaterade discs |
| GET   | `/api/manufacturer/show/:id`         | Hämta en tillverkare med specifikt ID |

---

## 📂 Datamodeller

### 🥏 Disc

```json
{
  "title": "Pure",
  "type": "Putter",
  "manufacturer": "ObjectId",
  "speed": 3,
  "glide": 3,
  "turn": -1,
  "fade": 1
}
```

### 🏠 Manufacturer

```json
{
  "name": "Latitude 64",
  "country": "Sweden"
}
```

---

## 🧪 Exempel med cURL

### 🔍 Sök i databasen

Du kan söka på både tillverkare och alla discars egenskaper genom att använda dig av kommandot:

```bash
curl -X GET "https://u05-wbsp.onrender.com/api/discs/index?search=<numeriskt värde, eller valfritt ord eller bokstav>"
```

### 🔍 Hämta alla discs

```bash
curl -X GET https://u05-wbsp.onrender.com/api/discs/index
```

### 🔍 Hämta disc med ID

```bash
curl -X GET https://u05-wbsp.onrender.com/api/discs/show/<disc_id>
```

### ➕ Skapa en ny disc

För att skapa en ny disc så behöver denna kopplas till en tillverkare genom tillverkarens ID. För att lägga till en ny tillverkare gå till [Skapa tillverkare](#-skapa-tillverkare).  
Om du vill lägga till en disc för en befintlig tillverkare, hämta ut tillverkarens ID genom `/api/manufacturer/index`.

```bash
curl -X POST https://u05-wbsp.onrender.com/api/discs/create \
-H "Content-Type: application/json" \
-d "{
  \"title\": \"Pure\",
  \"type\": \"Putter\",
  \"manufacturer\": \"67dd680dbd2fb5160033a719\",
  \"speed\": 3,
  \"glide\": 3,
  \"turn\": -1,
  \"fade\": 1
}"
```

### ✏️ Uppdatera en disc

```bash
curl -X PATCH https://u05-wbsp.onrender.com/api/discs/update/<disc_id> \
-H "Content-Type: application/json" \
-d "{
  \"title\": \"Nytt värde\"
}"
```

### ❌ Ta bort en disc

```bash
curl -X DELETE https://u05-wbsp.onrender.com/api/discs/delete/<disc_id>
```

---

### 🏠 Skapa tillverkare

```bash
curl -X POST https://u05-wbsp.onrender.com/api/manufacturer/create \
-H "Content-Type: application/json" \
-d "{
  \"name\": \"Latitude 64\",
  \"country\": \"Sweden\"
}"
```

### 🔍 Hämta alla tillverkare

```bash
curl -X GET https://u05-wbsp.onrender.com/api/manufacturer/index
```

### 🔍 Hämta en tillverkare baserat på ID

```bash
curl -X GET https://u05-wbsp.onrender.com/api/manufacturer/show/<manufacturer_id>
```

### ✏️ Uppdatera en tillverkare

För tillverkare kan du ändra 2 värden:

- name
- country

```bash
curl -X PATCH https://u05-wbsp.onrender.com/api/manufacturer/update/<manufacturer_id> \
-H "Content-Type: application/json" \
-d "{
  \"name\": \"Nytt värde\"
}"
```

### ❌ Ta bort tillverkare (och tillhörande discar)

```bash
curl -X DELETE https://u05-wbsp.onrender.com/api/manufacturer/delete/<manufacturer_id>
```

---

## 🔐 CORS

API:t tillåter för närvarande följande ursprung:

- `http://localhost:4200` (För framtida Frontend)
- `https://u05-wbsp.onrender.com`

---

## ⚠️ Felhantering

API:t svarar med felmeddelanden och HTTP-statuskoder.

| Kod  | Förklaring                          |
|------|-------------------------------------|
| 200  | OK – Begäran lyckades               |
| 400  | Bad Request – Saknad eller ogiltig data |
| 404  | Not Found – Resurs hittades ej      |
| 500  | Internal Server Error – Något gick fel på servern |

Exempel:

```json
{
  "success": false,
  "data": null,
  "error": "Ett internt serverfel uppstod när anrop gjordes",
  "message": null
}
```

---

## 👨‍💻 Byggt med

- Node.js
- Express
- MongoDB + Mongoose
- TypeScript
