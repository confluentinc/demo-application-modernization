#!/bin/sh
sudo yum update -y
sudo yum install docker -y
# sudo usermod -a -G docker ec2-user
sudo service docker start
sudo docker run -p 5432:5432 --name postgres -d mkananizadeh/app-mod-postgres
PG_READY=1
while [ $PG_READY -ne 0 ]; do
    sudo docker exec postgres pg_isready
    PG_READY=$?
    sleep 1
done
sudo docker exec -d postgres psql -U postgres -c 'CALL products.generate_orders();'
