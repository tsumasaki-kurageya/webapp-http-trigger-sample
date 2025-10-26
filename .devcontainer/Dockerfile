# Dev container for apiconnectormoc
# - Node.js 22 LTS
# - Python 3 + pip

FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-22.04

ARG NODE_MAJOR=22

USER root

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        gnupg \
        python3 \
        python3-pip \
        python3-venv \
    # Install Node.js (NodeSource)
    && curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    # Verify toolchain
    && node -v \
    && npm -v \
    && python3 --version \
    && pip3 --version \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Optional: preinstall Python packages commonly used in this repo
RUN pip3 install --no-cache-dir fastapi "uvicorn[standard]"

# Default to non-root user provided by the base image
USER vscode

WORKDIR /workspaces
