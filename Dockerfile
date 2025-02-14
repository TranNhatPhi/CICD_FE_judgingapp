# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"

# RUN corepack enable pnpm
# COPY . /app
# WORKDIR /app


# FROM base AS prod-deps
# ENV NODE_ENV="production"
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run turbo build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 5173
# CMD [ "pnpm", "serve" ]
FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

# lưu ý nginx dùng cổng mặc định là 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

