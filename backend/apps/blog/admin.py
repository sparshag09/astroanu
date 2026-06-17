from django.contrib import admin
from apps.blog.models import BlogPost, BlogCategory, BlogComment

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display   = ('title', 'category', 'author', 'is_published', 'publish_date', 'views_count', 'read_time')
    list_filter    = ('is_published', 'category', 'publish_date', 'created_at')
    search_fields  = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'created_at', 'updated_at')
    list_editable  = ('is_published',)
    date_hierarchy = 'publish_date'
    list_per_page  = 25
    fieldsets = (
        ('Content',    {'fields': ('title','slug','category','author','excerpt','content','featured_image')}),
        ('Publishing', {'fields': ('is_published','publish_date','read_time')}),
        ('Stats',      {'fields': ('views_count','created_at','updated_at'), 'classes': ('collapse',)}),
    )

@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display  = ('author', 'post', 'is_approved', 'created_at')
    list_filter   = ('is_approved', 'created_at')
    search_fields = ('content', 'author__email', 'post__title')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at', 'updated_at')
