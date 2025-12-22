FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# ✅ Copy Prisma schema BEFORE npm ci
COPY prisma ./prisma

# Install dependencies (postinstall now works)
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Build if needed
RUN npm run build

CMD ["npm", "start"]
