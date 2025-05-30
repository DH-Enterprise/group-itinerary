# Use PHP 8.3 FPM image
FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) intl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd opcache exif pcntl bcmath mysqli pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-enable apcu mysqli pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first to leverage Docker cache
COPY composer.* symfony.* /var/www/

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts \
    && composer clear-cache

# Copy the rest of the application
COPY . /var/www

# Create necessary directories
RUN mkdir -p /var/www/var/cache /var/www/var/log

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/var

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
