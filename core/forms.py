from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
        return user

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'location', 'city', 'state', 'country', 
            'latitude', 'longitude', 'avatar', 'phone', 'website',
            'availability', 'max_distance', 'is_public'
        ]
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
            'latitude': forms.HiddenInput(),
            'longitude': forms.HiddenInput(),
        }

class SkillForm(forms.ModelForm):
    class Meta:
        model = Skill
        fields = ['name', 'category', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class UserSkillForm(forms.ModelForm):
    class Meta:
        model = UserSkill
        fields = ['skill', 'skill_type', 'level', 'description', 'years_experience', 'hourly_rate']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class SwapRequestForm(forms.ModelForm):
    class Meta:
        model = SwapRequest
        fields = ['offered_skill', 'message', 'meeting_type', 'duration_hours']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['offered_skill'].queryset = Skill.objects.filter(
                userskill__user=user,
                userskill__skill_type='offered'
            )

class RatingForm(forms.ModelForm):
    class Meta:
        model = Rating
        fields = ['rating', 'feedback']
        widgets = {
            'rating': forms.Select(choices=[(i, f'{i} Star{"s" if i != 1 else ""}') for i in range(1, 6)]),
            'feedback': forms.Textarea(attrs={'rows': 4}),
        }
