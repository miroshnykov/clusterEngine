> traffic server 
## Cluster 
    A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.
    https://nodejs.org/api/cluster.html#cluster_cluster
## Recipe 
    recipe id getting from S3 bucket "co-recipe-prod"
    checking fileSizeOffersCheck  && fileSizeCampaignsCheck every 20 sec with co-recipe project if size of recipe is different then download new files from s3 and reload the data to local redis for each instances
## Redis
    each instanse has local redis with offers && campaigns populated with cron campaignsToRedisCron & offersToRedisCron

## Docker setup
	docker build -t clustrEngine .
   	docker run -it -p 5000:5000 --rm --name clustrEngine-  clustrEngine
## run
    npm run dev
## build
    npm run build
## env example
    HOST = localhost
    ENV = development
    PORT = 5000
    SOCKET_HOST=localhost
    SOCKET_PORT=3001
    
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=us-east-1
   
    OFFERS_RECIPE_PATH=/tmp/co-recipe-traffic/offersRecipe.json.gz
    CAMPAIGNS_RECIPE_PATH=/tmp/co-recipe-traffic/campaignsRecipe.json.gz
    
    S3_OFFERS_RECIPE_PATH=offersRecipe.json.gz
    S3_CAMPAIGNS_RECIPE_PATH=campaignsRecipe.json.gz
    S3_BUCKET_NAME=co-recipe-staging
    
    MAXMIND_PATH=/home/miroshnykov/Documents/GeoIP2-City.mmdb
    MAXMIND_PATH_ISP=/home/miroshnykov/Documents/GeoIP2-ISP_20210806/GeoIP2-ISP.mmdb