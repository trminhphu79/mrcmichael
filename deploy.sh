#!/bin/bash

echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

echo "🚀 Adding SSH host to known_hosts..."
ssh-keyscan -p 2222 -H "${VPS_IP}" >> ~/.ssh/known_hosts

echo "🚀 Connecting to VPS on port 2222..."
ssh -v -i ~/.ssh/id_rsa -p 2222 -o StrictHostKeyChecking=no "lelinh781@36.50.26.31" "echo '✅ SSH Connection Successful!'"

if [ $? -ne 0 ]; then
  echo "❌ SSH Connection Failed!"
  exit 1
fi

# scp -P 2222 Lelinh.070801@lelinh781@36.50.26.31:~/.ssh/id_rsa ~/.ssh/id_rsa_vps
# Lelinh.070801@lelinh781

# ssh-copy-id -i ~/.ssh/id_rsa_vps.pub -p 2222  lelinh.070801@lelinh781


# echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCm5HJcSEFVwns57WeKdCW6hNpndSkfMCsRfXCWQ+UsgLiKQw3pOBoq2VO6xzNWM004fxjaV4RoGckUwiGiEq8Z84P1qNa0ARAOWtEGi6CHx4nyEDx74NuBGFUD1RHxzy+VCqLNT+xQG393F2cV41mYYl3AKUAX7WH/kK9syKOA8y80K6M7T+7UifptoCDdQCzkYW4WdDWXHTznIFzpdWsPh3zvastLZ4ihxzZ1PpM1Hx3wPKdgHD6DRWAm+E7ZHrQ8IS3qC5Yd63QFaSXoEYW4kL3UaEGTD4i8ZjVcQXuUGwRA683+pWldEVI2Bhkp1L4xfiND/mWCUffUL6FrbGSg54IZnhUSDGmBBYyUtfmFuraH//vLPaXtrOSeBhYFXfZllZxbB/zzIwZVb3zDsllyHQ+Z89C4WjqzVXagtSvFsWdi5PWr4dg+lWYtaiJgjw6uzgDZXvqx0lMbEywbsCAZMk5SDXaceXaLQAyNnX1KghLILo6roursxYEsQrafyCrc1KqxD+pYWAQXYxd/UUV/Yo0WH/T+U7eXBeVNWCVRphWGkea8RhxWN5cnB+ytsoNXzy14oktmF7BzOLsohJlsU6SVxbocZ3i+rtKNawMd8L3Bd+d6pWloGzVdAocVEEHouTbHxXOJ0applWtc0q550xeb72g3xgv0ec18PpTzow== github-deploy" >> ~/.ssh/authorized_keys


# ssh -i ~/.ssh/id_rsa_vps -p 2222 lelinh781@36.50.26.31