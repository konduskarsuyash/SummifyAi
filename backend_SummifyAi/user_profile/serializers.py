from rest_framework import serializers
from .models import UserProfile, UserStatistics, UserContribution

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'bio', 'location']


class UserStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatistics
        fields = ['pdfs_summarized', 'quizzes_taken', 'yt_summaries_generated']



class UserContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContribution
        fields = ['user', 'date', 'is_active']
