> create recipe and send to s3 folder co-recipe
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