from django import forms
from .models import Content

class ContentForm(forms.ModelForm):
    class Meta:
        model=Content
        fields=['title','description','file','duration','content_type']
        widgets={
                'title':forms.TextInput(attrs={'class':'form-control'}),
                'description':forms.Textarea(attrs={'class':'form-control','rows':3}),
                'file':forms.FileInput(attrs={'class':'form-control'}),
                'duration':forms.NumberInput(attrs={'class':'form-control'}),
                'content_type':forms.TextInput(attrs={'class':'form-control'}),
        }
