# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('yiyuanduobao_shop', '0047_auto_20160502_2322'),
    ]

    operations = [
        migrations.AddField(
            model_name='noticemsg',
            name='shop',
            field=models.ForeignKey(verbose_name=b'\xe6\x89\x80\xe5\xb1\x9e\xe5\x95\x86\xe5\xba\x97', blank=True, to='yiyuanduobao_shop.Shop', null=True),
            preserve_default=True,
        ),
    ]
